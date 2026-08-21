import os
import time
import subprocess
import sys
from playwright.sync_api import sync_playwright
from PIL import Image

def generate_demo_gif():
    workspace = r"c:\Users\tk030\Desktop\何を作るか決めよう。ツール"
    
    # 1. Start local server
    port = 8765
    server_proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port)],
        cwd=workspace,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(1)
    
    frames_dir = os.path.join(workspace, "temp_frames")
    os.makedirs(frames_dir, exist_ok=True)
    
    # Clean previous frames
    for f in os.listdir(frames_dir):
        if f.endswith(".png"):
            try:
                os.remove(os.path.join(frames_dir, f))
            except:
                pass

    url = f"http://127.0.0.1:{port}/index.html"
    print(f"Opening {url} in Playwright...")
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            # Modern Mobile Viewport (400 x 780, High DPI)
            context = browser.new_context(
                viewport={"width": 400, "height": 780},
                device_scale_factor=2,
                is_mobile=True,
                has_touch=True
            )
            page = context.new_page()
            page.goto(url)
            page.wait_for_selector("#btn-start")
            page.wait_for_timeout(500)
            
            # Clear localStorage to start clean
            page.evaluate("localStorage.clear(); location.reload();")
            page.wait_for_selector("#btn-start")
            page.wait_for_timeout(600)
            
            frame_idx = 0
            def capture(count=1, delay=80):
                nonlocal frame_idx
                for _ in range(count):
                    f_path = os.path.join(frames_dir, f"frame_{frame_idx:04d}.png")
                    page.screenshot(path=f_path)
                    frame_idx += 1
                    if delay > 0:
                        page.wait_for_timeout(delay)

            # 1. Screen 1: Welcome (Hold 1.2s)
            print("Capturing Screen 1 (Welcome)...")
            capture(10, 100)
            
            # Click Start
            page.click("#btn-start")
            page.wait_for_timeout(200)
            capture(4, 60)
            
            # 2. Screen 2: Intent Selection
            print("Capturing Screen 2 (Intent & Tags)...")
            page.wait_for_selector('[data-intent-id="work"]')
            page.click('[data-intent-id="work"]')
            capture(8, 80)
            
            # Select Tags ("テキスト・文章", "ファイル・データ")
            page.click('[data-tag-id="text"]')
            capture(5, 70)
            page.click('[data-tag-id="file"]')
            capture(5, 70)
            
            # Click Next (Generate Prompt)
            page.click("#btn-step2-next")
            page.wait_for_timeout(250)
            capture(8, 80)
            
            # 3. Screen 3: AI Prompt & Copy
            print("Capturing Screen 3 (AI Prompt)...")
            page.wait_for_selector("#btn-copy-ideation")
            capture(6, 80)
            page.click("#btn-copy-ideation")
            capture(10, 80)
            
            # Click Next to Decision
            page.click("#btn-step3-next")
            page.wait_for_timeout(200)
            capture(6, 70)
            
            # 4. Screen 4: Decision Input
            print("Capturing Screen 4 (Decision Input)...")
            page.wait_for_selector("#input-decision-title")
            title = "ワンクリックPDFテキスト抽出ツール"
            desc = "PDFファイルをドラッグ＆ドロップすると、テキストを自動抽出してコピーできるWebツール。"
            
            # Type title smoothly
            for i in range(1, len(title) + 1):
                page.fill("#input-decision-title", title[:i])
                if i % 3 == 0:
                    capture(1, 50)
            capture(3, 70)
            
            # Type desc smoothly
            for i in range(1, len(desc) + 1, 4):
                page.fill("#input-decision-desc", desc[:i])
                if i % 8 == 0:
                    capture(1, 50)
            page.fill("#input-decision-desc", desc)
            capture(5, 70)
            
            # Click Decision Complete
            page.click("#btn-step4-next")
            page.wait_for_timeout(250)
            capture(8, 80)
            
            # 5. Screen 5: Choice & Dev Prompt Copy
            print("Capturing Screen 5 (Final Choice & Prompt)...")
            page.wait_for_selector("#btn-copy-dev")
            capture(6, 80)
            page.click("#btn-copy-dev")
            capture(14, 80)
            
            # Hold end screen
            capture(12, 100)
            
            browser.close()
            
        print(f"Captured {frame_idx} frames. Assembling GIF...")
        
        # Assemble GIF with Pillow
        all_files = sorted([os.path.join(frames_dir, f) for f in os.listdir(frames_dir) if f.endswith(".png")])
        if not all_files:
            print("No frames found!")
            return

        imgs = []
        # Target width 380px for crisp mobile view and optimal GIF file size
        for f in all_files:
            im = Image.open(f)
            target_w = 380
            target_h = int(im.height * (target_w / im.width))
            im_resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
            # Use adaptive palette with 128 colors for clean UI gradients & text readability
            im_p = im_resized.convert("RGB").quantize(colors=128, method=Image.Resampling.LANCZOS, dither=Image.Dither.NONE)
            imgs.append(im_p)

        out_gif = os.path.join(workspace, "x_demo.gif")
        imgs[0].save(
            out_gif,
            save_all=True,
            append_images=imgs[1:],
            duration=100,
            loop=0,
            optimize=True
        )
        
        size_mb = os.path.getsize(out_gif) / (1024 * 1024)
        print(f"Successfully generated GIF: {out_gif}")
        print(f"File size: {size_mb:.2f} MB, Total frames: {len(imgs)}")

    finally:
        server_proc.terminate()
        # Clean temporary frame files
        for f in os.listdir(frames_dir):
            try:
                os.remove(os.path.join(frames_dir, f))
            except:
                pass
        try:
            os.rmdir(frames_dir)
        except:
            pass

if __name__ == "__main__":
    generate_demo_gif()
