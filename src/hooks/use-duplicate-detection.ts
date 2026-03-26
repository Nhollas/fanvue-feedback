"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type SimilarFeedbackItem,
  similarFeedbackResponseSchema,
} from "@/app/api/feedback/similar/schema";

export function useDuplicateDetection(enabled: boolean) {
  const [suggestions, setSuggestions] = useState<SimilarFeedbackItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const lastCheckedRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const checkSimilar = useCallback(async () => {
    const title = titleRef.current.trim();
    const description = descriptionRef.current.trim();

    if (!enabled || !title) return;

    const key = `${title}\n${description}`;
    if (key === lastCheckedRef.current) return;

    lastCheckedRef.current = key;
    setIsSearching(true);
    setDismissed(false);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/feedback/similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
        signal: controller.signal,
      });

      if (res.ok) {
        const data = similarFeedbackResponseSchema.parse(await res.json());
        setSuggestions(data);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    } finally {
      setIsSearching(false);
    }
  }, [enabled]);

  const onTitleChange = useCallback((value: string) => {
    titleRef.current = value;
  }, []);

  const onDescriptionChange = useCallback((value: string) => {
    descriptionRef.current = value;
  }, []);

  const onFieldBlur = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(checkSimilar, 500);
  }, [checkSimilar]);

  const dismissSuggestions = useCallback(() => {
    setDismissed(true);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    titleRef.current = "";
    descriptionRef.current = "";
    lastCheckedRef.current = null;
    setDismissed(false);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return {
    suggestions: dismissed ? [] : suggestions,
    isSearching,
    onTitleChange,
    onDescriptionChange,
    onFieldBlur,
    dismissSuggestions,
    clearSuggestions,
  };
}
