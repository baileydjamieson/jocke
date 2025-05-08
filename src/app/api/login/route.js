import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400,
      });
    }

    await dbConnect();

    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
        status: 401,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
        status: 401,
      });
    }

    // You could optionally set a cookie or return session data here
    return new Response(JSON.stringify({ message: 'Login successful', user: { username: user.username } }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
