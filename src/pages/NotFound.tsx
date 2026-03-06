const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon pt-24">
      <div className="px-6 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
          404
        </p>
        <h1 className="mb-3 font-racing text-4xl font-bold tracking-[0.25em] text-gradient-red sm:text-5xl">
          OFF THE RACING LINE
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Use the navigation
          bar above to get back to the grid.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
