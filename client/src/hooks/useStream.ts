import { useState, useCallback } from "react";

interface StreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
}

export function useStream() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const stream = useCallback(
    async (
      endpoint: string,
      body: Record<string, unknown>,
      options: StreamOptions = {}
    ) => {
      setIsLoading(true);
      setContent("");
      setError(null);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable");
        }

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.error) {
                  throw new Error(data.error);
                }

                if (data.chunk) {
                  fullContent += data.chunk;
                  setContent(fullContent);
                  options.onChunk?.(data.chunk);
                }

                if (data.done) {
                  setIsLoading(false);
                  options.onComplete?.(fullContent);
                  return fullContent;
                }
              } catch (parseError) {
                if (parseError instanceof Error && parseError.message.includes("JSON")) {
                  // Ignore JSON parse errors from incomplete lines
                  continue;
                }
                throw parseError;
              }
            }
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setContent("");
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    stream,
    content,
    isLoading,
    error,
    reset,
  };
}
