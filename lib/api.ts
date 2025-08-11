import axios, { type AxiosResponse } from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!TOKEN)
  throw new Error(
    "Auth token is missing. Please set NEXT_PUBLIC_NOTEHUB_TOKEN."
  );

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {
    const response: AxiosResponse<FetchNotesResponse> = await axios.get(
      BASE_URL,
      {
        headers,
        params: { page, perPage, search: search || undefined },
      }
    );
    return response.data;
  } catch {
    throw new Error("Failed to fetch notes.");
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axios.get(`${BASE_URL}/${id}`, {
      headers,
    });
    return response.data;
  } catch {
    throw new Error("Failed to fetch note by id.");
  }
};

export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axios.post(BASE_URL, noteData, {
      headers,
    });
    return response.data;
  } catch {
    throw new Error("Failed to create note.");
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axios.delete(
      `${BASE_URL}/${id}`,
      { headers }
    );
    return response.data;
  } catch {
    throw new Error("Failed to delete note.");
  }
};
