const Loader = () => {
	return (
		<div className="flex justify-center items-end h-[100px] w-[300px]">
			<div className="w-[20px] h-[10px] bg-blue-500 rounded-[5px] mx-[5px] animate-wave" />
			<div className="w-[20px] h-[10px] bg-blue-500 rounded-[5px] mx-[5px] animate-wave animation-delay-100" />
			<div className="w-[20px] h-[10px] bg-blue-500 rounded-[5px] mx-[5px] animate-wave animation-delay-200" />
			<div className="w-[20px] h-[10px] bg-blue-500 rounded-[5px] mx-[5px] animate-wave animation-delay-300" />
		</div>
	);
};

export { Loader };
