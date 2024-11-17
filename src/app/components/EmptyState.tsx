interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div>
      <p className="text-center text-lg text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
