import { Roast } from './types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export async function getAllRoasts(page: number = 1, limit: number = 20) {
  const res = await fetch(`${API}/api/roasts?page=${page}&limit=${limit}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch roasts');
  }
  const json = await res.json();
  return {
    data: json.data.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt)
    })) as Roast[],
    pagination: json.pagination
  };
}

export async function getRoastById(id: string): Promise<Roast | null> {
  try {
    const res = await fetch(`${API}/api/roasts/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      ...json.data,
      createdAt: new Date(json.data.createdAt)
    } as Roast;
  } catch (err) {
    return null;
  }
}

export async function submitUrl(url: string): Promise<Roast> {
  const res = await fetch(`${API}/api/roast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });
  const json = await res.json();
  if (!res.ok) {
    throw { code: json.error, message: json.message || 'Failed to submit URL' };
  }
  return {
    ...json.data,
    createdAt: new Date(json.data.createdAt)
  } as Roast;
}
