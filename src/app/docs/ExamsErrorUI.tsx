"use client";

export function ExamsErrorUI() {
  return (
    <div className="text-center py-12">
      <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-8 max-w-md mx-auto shadow-md">
        <h3 className="text-red-800 font-bold text-lg mb-3">Failed to Load Featured Exams</h3>
        <p className="text-red-600 text-sm mb-6 leading-relaxed">
          We're having trouble loading the featured exam data. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Retry
        </button>
      </div>
    </div>
  );
}