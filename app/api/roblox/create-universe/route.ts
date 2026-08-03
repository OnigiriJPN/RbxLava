import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey, creatorId, title, privacy, templateId } = await request.json();

    if (!apiKey || !creatorId || !title) {
      return NextResponse.json({ error: '必要なパラメータ（APIキー、クリエイターID、タイトル）が不足しています。' }, { status: 400 });
    }

    const response = await fetch(`https://apis.roblox.com/universes/v1/creators/${creatorId}/universes`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: title,
        privacy: privacy, // 'Public' または 'Private'
        template: templateId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Roblox API側でエラーが返されました。');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      universeId: data.universeId,
      placeId: data.rootPlaceId,
    });

  } catch (err: any) {
    console.error('Roblox API Error:', err);
    return NextResponse.json({ error: err.message || '予期せぬエラーが発生しました。' }, { status: 500 });
  }
}
