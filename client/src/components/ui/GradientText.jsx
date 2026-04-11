const GradientText = ({ 
  children, 
  as: Component = 'span', 
  className = '', 
  glow = true 
}) => {
  return (
    <Component 
      className={`
        text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#00ffa3]
        ${glow ? 'filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default GradientText;
