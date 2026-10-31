"""Rebuild the game-specific sound compatibility patch. Requires JDK 8+ and Python 3."""
from pathlib import Path
import subprocess, tempfile, zipfile, shutil
root=Path(__file__).resolve().parent.parent
src=root/'source'
with tempfile.TemporaryDirectory() as tmp:
 t=Path(tmp); tones=t/'tones';tones.mkdir();classes=t/'classes';classes.mkdir()
 with zipfile.ZipFile(root/'original/KemoGame.jar') as z:
  for n in z.namelist():
   if n.endswith('.ott'): (tones/Path(n).name).write_bytes(z.read(n))
 subprocess.run(['javac','-d',str(classes),str(src/'org/recompile/mobile/Mobile.java'),str(src/'NokiaOTTDecoder.java'),str(src/'Convert.java')],check=True)
 resources=t/'patch/kemo-tones';resources.mkdir(parents=True)
 subprocess.run(['java','-cp',str(classes),'Convert',str(tones),str(resources)],check=True)
 runtime=root/'site/runtime/freej2me-web-audio-v4.jar'
 subprocess.run(['javac','--release','8','-cp',str(runtime),'-d',str(t/'patch'),str(src/'Sound.java'),str(src/'Displayable.java'),str(src/'Canvas.java')],check=True)
 subprocess.run(['jar','uf',str(runtime),'-C',str(t/'patch'),'.'],check=True)
 print('Updated:',runtime)
