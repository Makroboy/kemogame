package javax.microedition.lcdui;

import java.lang.reflect.Field;
import java.util.ArrayList;
import org.recompile.mobile.Mobile;
import pl.zb3.freej2me.bridge.shell.KeyEvent;
import sun.misc.Unsafe;

// Allocate without graphics initialization so native browser graphics are not needed.
public class BackCommandTest {
    static class Screen extends Displayable {
        int selected;
        protected void doCommand(int index) { if (index >= 0 && index < commands.size()) selected = index; }
        protected void _invalidate() {}
    }
    static class GameCanvas extends Canvas {
        int selected;
        protected void paint(Graphics g) {}
        protected void doCommand(int index) { if (index >= 0 && index < commands.size()) selected = index; }
        protected void _invalidate() {}
    }
    static Unsafe unsafe;
    static Displayable screen(boolean canvas, Command... commands) throws Exception {
        Displayable d = (Displayable)unsafe.allocateInstance(canvas ? GameCanvas.class : Screen.class);
        d.commands = new ArrayList<Command>();
        for (Command c : commands) d.commands.add(c);
        if (canvas) ((GameCanvas)d).selected = -1; else ((Screen)d).selected = -1;
        return d;
    }
    static void check(boolean canvas, int expected, Command... commands) throws Exception {
        Displayable d = screen(canvas, commands);
        KeyEvent key = (KeyEvent)unsafe.allocateInstance(KeyEvent.class);
        key.normalizedCode = Mobile.NOKIA_SOFT2;
        d.keyPressed(key);
        int selected = canvas ? ((GameCanvas)d).selected : ((Screen)d).selected;
        if (selected != expected) throw new AssertionError("Back selected " + selected + ", expected " + expected);
    }
    public static void main(String[] args) throws Exception {
        Field f = Unsafe.class.getDeclaredField("theUnsafe"); f.setAccessible(true); unsafe = (Unsafe)f.get(null);
        Command back = new Command("Back", Command.BACK, 0);
        Command ok = new Command("OK", Command.OK, 0);
        for (boolean canvas : new boolean[]{false, true}) {
            check(canvas, 0, back);
            check(canvas, 0, back, ok);
            check(canvas, 1, ok, back);
            check(canvas, 2, ok, ok, back);
            check(canvas, 0, new Command("Cancel", Command.CANCEL, 0));
            check(canvas, 0, new Command("Back", Command.SCREEN, 0));
            check(canvas, -1, ok);
            check(canvas, -1);
        }
        System.out.println("PASS: Back in either slot, single command, multiple commands, Cancel and Back labels; no unrelated sole command triggered; Form and Canvas routing");
    }
}
