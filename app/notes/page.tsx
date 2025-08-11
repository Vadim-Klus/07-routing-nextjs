import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  const params = { page: 1, perPage: 12, search: "" };

  const data = await queryClient.fetchQuery({
    queryKey: ["notes", params],
    queryFn: () => fetchNotes(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialNotes={data} />
    </HydrationBoundary>
  );
}
