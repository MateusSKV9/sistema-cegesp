const $ = document.querySelector.bind(document);

// Divs
const stateSelect = $('.section-state');
const grouping = $('.section-grouping');
const municipality = $('.section-municipality');
const territory = $('.section-territory');
const agenda = $('.section-agenda');
const judiciario = $('.judiciario');
const documentSelect = $('.section-document');
const periodSelect = $('.section-period');

// Inputs
const levelSelect = $('#level');
const radiosGrounping = document.querySelectorAll('input[name="radio-grounping"]');
const radiosAgenda = document.querySelectorAll('input[name="radio-agenda"]');

levelSelect.addEventListener('change', function () {
	if (this.value === 'Federal') {
		stateSelect.style.display = 'none';
        agenda.style.display = 'block';
        judiciario.style.display = 'block';

		grouping.style.display = 'none';
        documentSelect.style.display = 'none';
		periodSelect.style.display = 'none';
        
	} else if (this.value === 'State') {
        stateSelect.style.display = 'block';
        agenda.style.display = 'block';
        judiciario.style.display = 'none';
        
		grouping.style.display = 'none';
        documentSelect.style.display = 'none';
		periodSelect.style.display = 'none';
        
	} else if(this.value === 'Municipal') {
        stateSelect.style.display = 'block';
        agenda.style.display = 'none';
		grouping.style.display = 'block';

        documentSelect.style.display = 'none';
		periodSelect.style.display = 'none';

	}
});

radiosGrounping.forEach(radioGrounping => {
	radioGrounping.addEventListener('change', function () {
		if (this.value === 'municipality') {
			municipality.style.display = 'block';
			territory.style.display = 'none';
		} else if (this.value === 'territory') {
			municipality.style.display = 'none';
			territory.style.display = 'block';
		}
		agenda.style.display = 'block';
        judiciario.style.display = 'block';
	});
});

radiosAgenda.forEach(radioAgenda => {
	radioAgenda.addEventListener('change', function () {
		if (this.value === 'executive') {
			console.log('Executivo');
		} else if (this.value === 'legislative') {
			console.log('Legislativo');
		} else if (this.value === 'judicial') {
			console.log('Judiciario');
		}
		documentSelect.style.display = 'block';
		periodSelect.style.display = 'block';
	});
});