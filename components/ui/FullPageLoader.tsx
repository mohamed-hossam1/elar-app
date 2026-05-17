interface FullPageLoaderProps {
  text?: string;
}

export function FullPageLoader({ text = "Loading" }: FullPageLoaderProps) {
  return (
    <div
      role="status"
      aria-label={`Page ${text.toLowerCase()}`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background animate-loader-fade-in"
    >
      <div className="flex flex-col items-center gap-10 animate-loader-scale">
        <span className="headline text-5xl md:text-7xl tracking-tighter select-none">
          ELAR
        </span>

        <div className="h-[2px] w-36 md:w-44 overflow-hidden bg-muted">
          <div
            className="h-full w-full bg-[length:200%_100%] bg-gradient-to-r from-transparent via-foreground to-transparent animate-loader-progress"
          />
        </div>

        <p className="label text-muted-foreground select-none">{text}</p>
      </div>
    </div>
  );
}
