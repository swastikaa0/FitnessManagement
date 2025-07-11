import React from 'react';

// export default function Footer() {
//   return (
//     <footer className="bg-black/40 backdrop-blur-sm border-t border-white/20 py-8 px-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
//           <div className="space-y-4">
//             <h3 className="text-2xl font-bold text-white">FIT ME</h3>
//             <p className="text-gray-300 text-sm leading-relaxed">
//               Your ultimate fitness companion for tracking workouts and achieving health goals.
//             </p>
//           </div>

//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold text-white">Contact Us</h4>
//             <div className="space-y-2 text-sm text-gray-300">
//               <p>📧 support@fitme.com</p>
//               <p>📞 +977 9828282828</p>
//               <p>📍 Softwarica College, Dillibazar</p>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-white/20 pt-6">
//           <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//             <div className="flex flex-wrap gap-6 text-sm text-gray-300">
//               <FooterLink href="/privacy-policy" text="Privacy Policy" />
//               <FooterLink href="/terms-of-service" text="Terms of Service" />
//               <FooterLink href="/contact" text="Contact Us" />
//             </div>
//             <p className="text-sm text-gray-400 text-center md:text-right">
//               © 2025 FIT ME. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// function FooterLink({ href, text }) {
//   return (
//     <a
//       href={href}
//       className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:underline"
//     >
//       {text}
//     </a>
//   );
// }