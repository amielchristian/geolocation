import { addUser, initializeDB, updateHistory } from "./db.js";

initializeDB();

await addUser("amiel@yahoo.com", "Amiel Mala-ay", "1234");
await addUser("christian@gmail.com", "Christian Estrada", "1234");
await addUser("candace@gmail.com", "Candace Muzan", "1234");
await addUser("ryan@hotmail.com", "Tokito", "1234");

await updateHistory("christian@gmail.com", "Manila", "8.8.8.8");
await updateHistory("amiel@yahoo.com", "Cebu", "8.8.81.8");
await updateHistory("amiel@yahoo.com", "Beijing", "8.81.8.8");
await updateHistory("amiel@yahoo.com", "Ho Chi Minh City", "8.8.8.81");
