export function printConsoleArt() {
  const helmet = `
%c
 ██╗      ██╗ █████╗ ███╗   ███╗ █████╗ ██████╗
 ██║      ██║██╔══██╗████╗ ████║██╔══██╗██╔══██╗
 ██║      ██║███████║██╔████╔██║███████║██████╔╝
 ██║      ██║██╔══██║██║╚██╔╝██║██╔══██║██╔══██╗
 ███████╗ ██║██║  ██║██║ ╚═╝ ██║██║  ██║██║  ██║
 ╚══════╝ ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝

     ██╗ █████╗  ██████╗██╗  ██╗███████╗ ██████╗ ███╗   ██╗
     ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔═══██╗████╗  ██║
     ██║███████║██║     █████╔╝ ███████╗██║   ██║██╔██╗ ██║
██   ██║██╔══██║██║     ██╔═██╗ ╚════██║██║   ██║██║╚██╗██║
╚█████╔╝██║  ██║╚██████╗██║  ██╗███████║╚██████╔╝██║ ╚████║
 ╚════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝

             #8  |  THE FRANCHISE  |  MVP x2  |  SB CHAMP
`;

  console.log(
    helmet,
    'color: #FFB800; font-family: monospace; font-size: 10px; line-height: 1.2;'
  );

  console.log(
    '%cYou inspect elements? Respect. — LJ8',
    'color: #7B2FBE; font-family: JetBrains Mono, monospace; font-size: 14px; font-weight: bold;'
  );

  console.log(
    '%cBuilt by DNS | DNS goes hard',
    'color: #A0A0A0; font-family: JetBrains Mono, monospace; font-size: 12px;'
  );

  console.log(
    '%cv1.0 — The Franchise. built different. — DNS',
    'color: #FFB800; font-family: JetBrains Mono, monospace; font-size: 11px;'
  );
}
