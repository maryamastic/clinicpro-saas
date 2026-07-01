function Loader({ text = "Loading..." }) {
    return (
        <div className="flex items-center gap-3 text-slate-600">
            <div className="w-5 h-5 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span>{text}</span>
        </div>
    );
}

export default Loader;