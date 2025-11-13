Image optimization helper

Run the included Python script to generate optimized assets into `images/optimized/`.

Requirements:
- Python 3.8+
- Pillow: `pip install pillow`

Run:

```powershell
Set-Location -Path 'c:\akay_kuruyemis'
python .\scripts\optimize_images.py
```

This will create WebP variants and a medium JPEG you can reference in `srcset` attributes.

Notes:
- The site now uses `images/optimized/` files and the script has been run (if you ran it locally).
- If you add or replace images in `images/`, re-run the script to regenerate optimized variants.
- After regenerating, refresh the page (hard refresh) to ensure new images load from the `optimized/` folder.
