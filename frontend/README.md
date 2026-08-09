# CollabSpace Frontend

React + Vite frontend for the Collaborative Document Editor backend.

## Current features

- Register and login
- JWT authentication
- Protected routes
- Document dashboard
- Search documents
- Create documents
- Open/edit documents
- Autosave through `PUT /document/:id`
- Delete documents
- Responsive dark workspace UI
- Rich text basics using the browser editing API

## Run

1. Start the backend on `http://localhost:3000`.
2. Install frontend dependencies:

```bash
npm install
```

3. Start Vite:

```bash
npm run dev
```

Open `http://localhost:5173`.

The Vite development proxy forwards `/user`, `/document`, and `/health` to the backend.

## Next engineering phases

1. Replace basic browser editing with a proper editor model.
2. Add Socket.IO/WebSocket collaboration.
3. Add Yjs/CRDT synchronization.
4. Add presence and live cursors.
5. Add document sharing and RBAC.
6. Add version history.
7. Add Redis for distributed collaboration.
8. Add AI/RAG document assistant.
9. Add tests, Docker, CI/CD and deployment.
