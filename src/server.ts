import app from './app';
import { connectDB } from './config';

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();      // 👈 connect to MongoDB first

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
