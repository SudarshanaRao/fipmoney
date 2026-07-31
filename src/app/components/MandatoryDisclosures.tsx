import React from "react";
import { Building2, MapPin, FileText, Mail, Hash, Phone } from "lucide-react";

export default function MandatoryDisclosures() {
  const disclosures = [
    {
      title: "Corporate Office",
      icon: <Building2 className="w-4 h-4 text-amber-600" />,
      content: [
        "#709, Gowra Fountain Head, HUDA Techno Enclave, Mindspace Rd, HITEC City, Hyderabad, Telangana 500081"
      ]
    },
    {
      title: "Registered Office",
      icon: <MapPin className="w-4 h-4 text-amber-600" />,
      content: [
        "8-3-231/A/278 & 279, Flat No. 404, Sri Krishna Nagar, Yousufguda, Khairatabad, Hyderabad – 500045, Telangana"
      ]
    },
    {
      title: "Company Legal Name",
      icon: <FileText className="w-4 h-4 text-amber-600" />,
      content: [
        "Finpages Tech Private Limited"
      ]
    },
    {
      title: "Official Email ID",
      icon: <Mail className="w-4 h-4 text-amber-600" />,
      content: [
        "info@fipmoney.com"
      ]
    },
    {
      title: "Corporate Identification No.",
      icon: <Hash className="w-4 h-4 text-amber-600" />,
      content: [
        "U66190TS2024PTC183295"
      ]
    },
    {
      title: "Telephone Number",
      icon: <Phone className="w-4 h-4 text-amber-600" />,
      content: [
        "9490841941 (Monday to Friday | 10:00 AM – 6:00 PM)",
        "WhatsApp Support (24/7) – https://wa.me/919491841941"
      ]
    }
  ];

  return (
    <section className="py-16 bg-[#fafafb] font-sans border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight font-serif mb-2">
            Mandatory Disclosures
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disclosures.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[20px] p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
              </div>
              
              <div className="border-t border-dashed border-slate-200 mb-4" />
              
              <ul className="space-y-3 flex-1">
                {item.content.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2"></span>
                    {text.includes('http') ? (
                      <span className="break-all">
                        {text.split('–')[0]} – <a href={text.split('–')[1].trim()} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{text.split('–')[1].trim()}</a>
                      </span>
                    ) : (
                      <span>{text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
