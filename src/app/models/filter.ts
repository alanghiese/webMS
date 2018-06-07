export class Filter{
	constructor(
			public excludeSurname: string,
			public foundSurname: string,
			public selUntil: string,
			public selSince: string,
			public selService: string,
			public selPractice: string,
			public selCoverage: string,
			public selDoctor: string
		){}
}