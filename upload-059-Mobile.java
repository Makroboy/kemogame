package org.recompile.mobile;
public class Mobile { public static final int LOG_DEBUG=0, LOG_WARNING=1, LOG_ERROR=2; public static int minLogLevel=2; public static void log(int level,String msg) { if(level==2) System.err.println(msg); } }
