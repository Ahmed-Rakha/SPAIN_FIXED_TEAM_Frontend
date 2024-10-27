import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tables/')({
  component: () => <div>Hello /tables/!</div>,
});
