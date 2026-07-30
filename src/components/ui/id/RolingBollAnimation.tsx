export function RolingBollAnimation() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-32 h-32 rounded-full border-4 border-black overflow-hidden animate-spin">
        {/* 上半分（赤） */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500" />

        {/* 下半分（白） */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />

        {/* 真ん中の黒線 */}
        <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 bg-black" />

        {/* 中央ボタン */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-black bg-white z-10">
          <div className="absolute inset-1 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
