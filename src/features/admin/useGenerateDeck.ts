import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateDeck, fetchGenerationRuns, type GenerateDeckInput } from './generateApi';

/** Start-generation mutation + the recent-runs list (admin dashboard). */
export function useGenerateDeck() {
  const qc = useQueryClient();
  const runs = useQuery({ queryKey: ['generation-runs'], queryFn: fetchGenerationRuns });

  const start = useMutation({
    mutationFn: (input: GenerateDeckInput) => generateDeck(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['generation-runs'] });
      await qc.invalidateQueries({ queryKey: ['admin-decks'] });
    },
  });

  return {
    runs: runs.data ?? [],
    isLoading: runs.isLoading,
    generate: start.mutateAsync,
    isGenerating: start.isPending,
    refetchRuns: () => qc.invalidateQueries({ queryKey: ['generation-runs'] }),
  };
}
