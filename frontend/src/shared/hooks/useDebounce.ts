import { useState, useEffect } from 'react';

// Este hook recebe um valor e um tempo de atraso (delay)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um temporizador que só vai atualizar o 'debouncedValue'
    // depois que o 'delay' passar
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Se o usuário digitar de novo, o temporizador antigo é cancelado
    // e um novo é criado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda de novo só se o valor ou o delay mudarem

  return debouncedValue;
}