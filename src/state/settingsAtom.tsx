import {atom} from "jotai"
import {atomWithStorage} from "jotai/utils";
export const darkModeAtom=atomWithStorage("dark",false);
export const cameraAccessAtom= atomWithStorage("allow",false); 