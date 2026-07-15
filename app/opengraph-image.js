import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Полдень — живая лента новостей';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F6EFE3 0%, #FFFBF2 100%)',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#C17F3E',
            marginBottom: 36,
          }}
        />
        <div
          style={{
            fontSize: 130,
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#2E2013',
            letterSpacing: '-2px',
          }}
        >
          Полдень
        </div>
        <div style={{ fontSize: 34, color: '#A8461F', marginTop: 18 }}>
          живая лента новостей
        </div>
      </div>
    ),
    { ...size }
  );
}
