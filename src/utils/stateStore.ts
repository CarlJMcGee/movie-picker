import { atom } from "jotai";
import { MovieQuery } from "../types/imbd-data";
import { User } from "@prisma/client";

export const unavailableAtom = atom<MovieQuery[]>([]);
export const availableAtom = atom<MovieQuery[]>([]);
export const pickedAtom = atom<MovieQuery[]>([]);
export const winnerAtom = atom<MovieQuery | null>(null);
export const sessionAtom = atom<User | null>(null);
