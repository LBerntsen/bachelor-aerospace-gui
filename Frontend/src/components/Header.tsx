import aerospaceLogo from "../assets/Aerospace_logo.png";

interface HeaderProps
{
  pageName: string
}

export default function Header ({pageName} : HeaderProps)
{
  return (
    <div className="flex justify-between p-3 gap-3 px-4 bg-[#161616]">
        <div>
            <img className="w-48 object-contain" src={aerospaceLogo}/>
        </div>
        <div className="text-white text-2xl tracking-[0.25em]">
            {pageName}
        </div>
    </div>
  )
};