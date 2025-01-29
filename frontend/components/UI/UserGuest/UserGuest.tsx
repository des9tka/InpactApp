function UserGuest({ ...props }) {
	return (
		<div
			{...props}
			className={`relative border-2 rounded-[50%] py-2 px-4 h-[50px] w-[50px] overflow-hidden cursor-pointer ${
				props.className || ""
			}`}
		>
			<div
				className="
				absolute 
				w-[35px] 
				h-[35px] 
				border-2 border-white 
				rounded-[75%] 
				border-b-0
				border-r-0
				border-l-0
				-bottom-4
				left-1/2
				transform -translate-x-1/2
				bg-sky-700
				z-10
				"
			></div>

			<div
				className="
				absolute
				w-[25px] 
				h-[25px] 
				border border-white 
				rounded-[50%] 
				top-2
				left-1/2
				transform -translate-x-1/2
				bg-sky-700
				z-20
				"
			></div>
		</div>
	);
}

export { UserGuest };
