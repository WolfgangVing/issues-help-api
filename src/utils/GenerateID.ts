import { customAlphabet, nanoid } from "nanoid";

export const createIssueID = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPKRSTUVWXYZ",
    6
);

export const createUserID = () => nanoid();
export const createNominationID = () => nanoid(8);