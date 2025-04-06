export default function Loaders({title}) {
    return (
      <div className="flex justify-center items-center h-full py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2" />
          <p className="text-sm text-white">{title}</p>
        </div>
      </div>
    );
  }
  