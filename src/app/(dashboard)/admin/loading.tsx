export default function AdminLoading() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-svitPrimary"></div>
          <span className="ml-3 text-svitPrimary">Loading admin page...</span>
        </div>
      </div>
    </div>
  );
}


