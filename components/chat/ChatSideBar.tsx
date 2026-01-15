"use client";

type Site = {
  id: string;
  url: string;
};

type Props = {
  sites: Site[];
  activeSiteId: string | null;
  onSelect: (siteId: string) => void;
};

export default function ChatSidebar({ sites, activeSiteId, onSelect }: Props) {
  return (
    <aside className="w-72 border-r bg-muted/30 p-4 overflow-y-auto">
      <h2 className="font-semibold mb-4">History</h2>

      {sites.length === 0 && (
        <p className="text-sm text-muted-foreground">No chats yet</p>
      )}

      <div className="space-y-2">
        {sites.map((site) => (
          <button
            key={site.id}
            onClick={() => onSelect(site.id)}
            className={`block w-full text-left rounded-md p-2 text-sm truncate transition ${
              site.id === activeSiteId
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {site.url}
          </button>
        ))}
      </div>
    </aside>
  );
}
