"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cellsApi, statsApi, templatesApi } from "@/lib/api/endpoints";
import type {
  AlertType,
  CellSiteCreateInput,
  CellSiteUpdateInput,
  CellStatus,
  TemplateCreateInput,
  TemplateUpdateInput,
} from "@/types/domain";
import { queryKeys } from "./query-keys";

// ---- Dashboard -------------------------------------------------------------

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: ({ signal }) => statsApi.dashboard(signal),
    refetchInterval: 30_000,
  });
}

// ---- Templates -------------------------------------------------------------

interface TemplateParams {
  category?: string;
  alert_type?: AlertType;
  active_only?: boolean;
}

export function useTemplates(params: TemplateParams = {}) {
  return useQuery({
    queryKey: queryKeys.templates.list(params),
    queryFn: ({ signal }) => templatesApi.list(params, signal),
  });
}

export function useSaveTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id?: string; input: TemplateCreateInput | TemplateUpdateInput }) =>
      args.id
        ? templatesApi.update(args.id, args.input)
        : templatesApi.create(args.input as TemplateCreateInput),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.templates.all }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templatesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.templates.all }),
  });
}

// ---- Cell sites --------------------------------------------------------------

export function useCells(status?: CellStatus) {
  return useQuery({
    queryKey: queryKeys.cells.list(status),
    queryFn: ({ signal }) => cellsApi.list(status, signal),
    refetchInterval: 60_000,
  });
}

/** Live eNodeB status — polls the cell over SSH, so it is only enabled on demand. */
export function useCellStatus(id: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.cells.status(id),
    queryFn: ({ signal }) => cellsApi.status(id, signal),
    enabled,
    staleTime: 15_000,
  });
}

export function useHealthCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cellsApi.healthCheck(),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.cells.all }),
        qc.invalidateQueries({ queryKey: queryKeys.stats }),
      ]),
  });
}

export function useSaveCell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id?: string; input: CellSiteCreateInput | CellSiteUpdateInput }) =>
      args.id ? cellsApi.update(args.id, args.input) : cellsApi.create(args.input as CellSiteCreateInput),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cells.all }),
  });
}

export function useDeleteCell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cellsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cells.all }),
  });
}
