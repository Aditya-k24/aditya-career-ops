%% mcdowellcv10.cls — mcdowellcv at 10pt with compact spacing
%% Based on mcdowellcv v1.2.0 by Daniil Belyakov (MIT License)
%% Modified: font 11pt→10pt, margins tightened, spacing scaled down

\ProvidesClass{mcdowellcv10}[2026/06/21 v1.0.0 McDowell CV 10pt compact]

\def\mainfontsize{10pt}
\def\mainfontface{Times New Roman}

\DeclareOption{calibri}{\def\mainfontface{Calibri}}

\def\papersize{letterpaper}
\newif\ifpapersize

\DeclareOption{a4paper}{\def\papersize{a4paper}\papersizetrue}
\DeclareOption{letterpaper}{\def\papersize{letterpaper}\papersizefalse}
\ProcessOptions\relax

\LoadClass[\papersize,\mainfontsize]{article}

\usepackage[left=0.5in,top=0.45in,right=0.5in,bottom=0.45in]{geometry}

\usepackage{fontspec}
\setmainfont[SmallCapsFeatures={Renderer=Basic},
Ligatures={TeX, NoCommon, NoDiscretionary}]{\mainfontface}

\usepackage[parfill]{parskip}
\usepackage{array}
\usepackage{etoolbox}
\pagestyle{empty}
\usepackage{tabu}
\usepackage{changepage}
\usepackage{enumitem}
\setlist{leftmargin=*, noitemsep, topsep=-1\parskip}
\usepackage{ifthen}
\usepackage{ifplatform}
\usepackage{microtype}

\DeclareMicrotypeSet*{smallcapsi}{
  encoding = {OT1,T1,T2A,LY1,OT4,QX,T5,TS1,EU1,EU2},
  shape = {sc*,si,scit}
}

%--- Spacing constants (scaled for 10pt / compact layout) ---
\ifthenelse{\equal{\platformname}{\notwindowsname}}{
  \def\namespaceskip{0.575em}
  \def\afterheaderspace{0pt}
  \def\beforesectionheaderspace{2.5pt}
  \def\sectionheadermargin{6pt}
  \def\beforesectionheaderhrulespace{1.5pt}
  \def\sectionheaderhrlueheight{0.518pt}
  \def\aftersectionheaderspace{-5pt}
  \ifpapersize
    \def\aftersinglelinesubsectionheaderspace{-5pt}
  \else
    \def\aftersinglelinesubsectionheaderspace{-19pt}
  \fi
  \def\afterdoublelinesubsectionheaderspace{-10pt}
  \def\aftermultilinesubsectionheaderspace{-6.5pt}
  \def\afteremptysubsectionheaderspace{0.5pt}
  \def\subsectionmargin{9pt}
  \def\aftersubsectionspace{0pt}
}{
  \def\namespaceskip{0.4em}
  \def\afterheaderspace{2pt}
  \def\beforesectionheaderspace{4pt}
  \def\sectionheadermargin{6pt}
  \def\beforesectionheaderhrulespace{2.5pt}
  \def\sectionheaderhrlueheight{0.5pt}
  \def\aftersectionheaderspace{-3.5pt}
  \ifpapersize
    \def\aftersinglelinesubsectionheaderspace{-3.5pt}
  \else
    \def\aftersinglelinesubsectionheaderspace{-17pt}
  \fi
  \def\afterdoublelinesubsectionheaderspace{-9pt}
  \def\aftermultilinesubsectionheaderspace{-5.5pt}
  \def\afteremptysubsectionheaderspace{2.5pt}
  \def\subsectionmargin{9pt}
  \def\aftersubsectionspace{3pt}
}

%--- Header ---
\makeatletter
\newcommand\address[1]{\def\@address{#1}}
\address{}
\newcommand\printaddress{\small{\@address}}

\newcommand\name[1]{\def\@name{#1}}
\name{}
\newcommand\printname{
  \spaceskip \namespaceskip \relax
  \textbf{\LARGE\textls[110]{\textsc{\@name}}}
}

\newcommand\contacts[1]{\def\@contacts{#1}}
\contacts{}
\newcommand\printcontacts{\small{\@contacts}}

\newcommand\makeheader{
  \begin{center}
    \begin{tabu} to 1\textwidth { X[l,m] X[2,c,m] X[r,m] }
      \printaddress & \printname & \printcontacts \\
    \end{tabu}
  \end{center}
  \vspace*{\afterheaderspace}
}
\makeatother

%--- Sections ---
\makeatletter
\newenvironment{cvsection}[1]{
  \vspace*{\beforesectionheaderspace}
  \begin{adjustwidth}{\sectionheadermargin}{\sectionheadermargin}
    \textsc{\textbf{#1}}
  \end{adjustwidth}
  \vspace*{\beforesectionheaderhrulespace}
  \hrule height \sectionheaderhrlueheight
  \vspace*{\aftersectionheaderspace}
}{}
\makeatother

%--- Subsections ---
\makeatletter
\newtoggle{lefttitledefined}
\newtoggle{centertitledefined}
\newtoggle{righttitledefined}

\newenvironment{cvsubsection}[4][1]{
  \notblank{#2}{\toggletrue{lefttitledefined}}{}
  \notblank{#3}{\toggletrue{centertitledefined}}{}
  \notblank{#4}{\toggletrue{righttitledefined}}{}
  \ifboolexpr{togl {lefttitledefined} or togl {centertitledefined} or togl {righttitledefined}}{
    \begin{tabu} to 1\textwidth { X[l,p] X[c,p] X[r,p] }
      \textbf{#2} & \textbf{#3} & \textbf{#4} \\
    \end{tabu}
    \ifnumcomp{#1}{=}{1}{\vspace*{\aftersinglelinesubsectionheaderspace}}{
      \ifnumcomp{#1}{=}{2}{\vspace*{\afterdoublelinesubsectionheaderspace}}{
        \vspace*{\aftermultilinesubsectionheaderspace}
      }
    }
  }{
    \vspace*{\afteremptysubsectionheaderspace}
  }
  \togglefalse{lefttitledefined}
  \togglefalse{centertitledefined}
  \togglefalse{righttitledefined}
  \begin{adjustwidth}{\subsectionmargin}{\subsectionmargin}
}{
  \end{adjustwidth}
  \vspace*{\aftersubsectionspace}
}
\makeatother
