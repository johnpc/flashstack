import { useQuery } from '@tanstack/react-query';
import { getUrl } from 'aws-amplify/storage';

async function resolveUrl(path: string): Promise<string> {
  const { url } = await getUrl({ path });
  return url.toString();
}

/** Resolves an S3 media key (image/audio) to a displayable URL (null if none). */
export function useMediaUrl(path: string | null | undefined): string | null {
  const query = useQuery({
    queryKey: ['media-url', path],
    queryFn: () => resolveUrl(path as string),
    enabled: !!path,
    staleTime: 5 * 60_000,
  });
  return query.data ?? null;
}
