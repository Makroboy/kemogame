import java.nio.file.*;
import javax.microedition.media.decoders.NokiaOTTDecoder;
public class Convert { public static void main(String[] args) throws Exception { for(Path p: Files.newDirectoryStream(Paths.get(args[0]),"*.ott")) { byte[] data=Files.readAllBytes(p); byte[] midi=NokiaOTTDecoder.convertToMidi(data); String hash=Integer.toString(java.util.Arrays.hashCode(data)); Files.write(Paths.get(args[1],hash+".mid"),midi); System.out.println(p.getFileName()+" -> "+hash+".mid ("+midi.length+")"); } } }
