//this is just a test for an eventual youtube live feed component, not used in the current version of the app
type YouTubeLiveEmbedProps = {
  videoId: string;
};

export default function YouTubeLiveEmbed({
  videoId,
}: YouTubeLiveEmbedProps) {
  const src = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div className="relative w-full max-w-240 aspect-video">
      <iframe
        src={src}
        title="YouTube live stream"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}