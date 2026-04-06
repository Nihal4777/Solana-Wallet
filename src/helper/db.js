import { openDB } from 'idb';

const DB_NAME = 'solana-wallet';
const STORE_NAME = 'accounts';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
    },
});

// Add account
export const addAccounts = async (item) => {
    const db = await dbPromise;
    return db.put(STORE_NAME, item);
};

// Get all accounts
export const getAccounts = async () => {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
};
