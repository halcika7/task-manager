'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export enum Action {
  EDIT = 'edit',
  DELETE = 'delete',
  CREATE = 'create',
  FILTERS = 'filters',
}

type ActionContextType<T> = {
  action: Action | null;
  setAction: (action: Action | null) => void;
  selectedData: T | null;
  handleSetSelectedData: (data: T | null, action: Action | null) => void;
};

export function createActionContext<T>() {
  const Context = createContext<ActionContextType<T> | null>(null);

  function Provider({
    children,
    initialAction,
    initialSelectedData,
  }: {
    children: ReactNode;
    initialAction?: Action;
    initialSelectedData?: T | null;
  }) {
    const [action, setAction] = useState<Action | null>(initialAction ?? null);
    const [selectedData, setSelectedData] = useState<T | null>(
      initialSelectedData ?? null
    );

    const handleSetSelectedData = useCallback(
      (data: T | null, action: Action | null) => {
        setSelectedData(data);
        setAction(action);
      },
      []
    );

    const value = useMemo(
      () => ({
        action,
        setAction,
        selectedData,
        handleSetSelectedData,
      }),
      [action, selectedData, handleSetSelectedData]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useAction() {
    const context = useContext(Context);
    if (!context) {
      throw new Error('useAction must be used within an ActionProvider');
    }
    return context;
  }

  return {
    Provider,
    useAction,
  } as const;
}
