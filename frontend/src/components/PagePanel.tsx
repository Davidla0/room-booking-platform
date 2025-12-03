import React from 'react';

interface PagePanelProps {
  title: string;
  subtitle?: string;
  rightMeta?: React.ReactNode;
  children: React.ReactNode;
}

export function PagePanel({ title, subtitle, rightMeta, children }: PagePanelProps) {
  return (
    <div className="page-centered">
      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">{title}</div>
            {subtitle && <div className="panel-subtitle">{subtitle}</div>}
          </div>
          {rightMeta && <div className="panel-subtitle">{rightMeta}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}


