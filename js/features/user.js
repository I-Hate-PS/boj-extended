function extendUserPage() {
  Utils.loadCSS('css/user.css');

  function display(containers, key, visible) {
    containers.forEach((panel) => {
      if (visible) {
        panel.setAttribute(key, true);
      } else {
        panel.removeAttribute(key);
      }
    });
  }

  function getCurrentUsername() {
    const { pathname } = window.location;
    return pathname.replace('/user/', '') || '';
  }

  const panels = Array.from(document.getElementsByClassName('problem-list'));

  const checkboxes = document.createElement('div');
  const checkbox1 = document.createElement('input');
  checkbox1.setAttribute('type', 'checkbox');
  checkbox1.setAttribute('id', 'show-pid');
  checkbox1.addEventListener('change', (evt) => {
    Config.save('show-pid', evt.target.checked);
    display(panels, 'show-id', evt.target.checked);
  });
  const checkbox2 = document.createElement('input');
  checkbox2.setAttribute('type', 'checkbox');
  checkbox1.setAttribute('id', 'show-pname');
  checkbox2.addEventListener('change', (evt) => {
    Config.save('show-pname', evt.target.checked);
    display(panels, 'show-name', evt.target.checked);
  });

  const label1 = document.createElement('label');
  label1.setAttribute('for', 'show-pid');
  label1.innerText = '문제 번호';
  const label2 = document.createElement('label');
  label2.setAttribute('for', 'show-pname');
  label2.innerText = '문제 제목';

  checkboxes.setAttribute('class', 'problem-toggles');
  checkboxes.appendChild(checkbox1);
  checkboxes.appendChild(label1);
  checkboxes.appendChild(checkbox2);
  checkboxes.appendChild(label2);

  try {
    const wrapper = document.getElementsByClassName('col-md-9')[0];
    // add checkboxes whether problem's id or name
    wrapper.insertBefore(checkboxes, wrapper.firstChild);
    // add vs form
    wrapper.insertBefore(
      createVsForm(getCurrentUsername(), getMyUsername()), // eslint-disable-line no-undef
      checkboxes
    );
  } catch (e) {
    console.error(e);
  }

  const MAX_DISPLAY_ITEMS = 100;

  // set data-problem-id
  panels.forEach((panel) => {
    const problemTags = Array.from(panel.getElementsByTagName('a'));
    problemTags.forEach((e) => {
      if (!e.href) return;
      e.classList.add('problem-link-style-box');
    });
    setProblemAttributes(problemTags);

    // add button to display all
    if (problemTags.length > MAX_DISPLAY_ITEMS) {
      panel.classList.add('collpased');
      const panelFooter = Utils.createElement('div', { class: 'panel-footer' });
      const showButton = Utils.createElement('a', { class: 'btn-display-all' });
      showButton.innerText = '모두 보기';
      showButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        panel.classList.remove('collpased');
        panelFooter.classList.add('hidden');
      });
      panelFooter.appendChild(showButton);
      panel.closest('.panel').appendChild(panelFooter);
    }
  });

  // sync with configs
  Config.load('show-pid', (checked) => {
    checked = checked === null || checked === undefined ? true : checked;
    checkbox1.checked = checked;
    display(panels, 'show-id', checked);
  });
  Config.load('show-pname', (checked) => {
    checkbox2.checked = checked;
    display(panels, 'show-name', checked);
  });

  function setProblemAttributes(problemTags) {
    const getPidfromProblemHref = (tag) => Number(tag.textContent);
    const pids = problemTags
      .map((tag) => ({ element: tag, id: getPidfromProblemHref(tag) }))
      .filter((x) => !isNaN(x.id));
    const listToMap = (list) =>
      [{ id: '' }].concat(list).reduce((p, c) => ({ ...(p || {}), [c.id]: c }));
    for (let i = 0; i <= Math.ceil(pids.length / 100); ++i) {
      const batch = pids.slice(i * 100, (i + 1) * 100) || [];
      if (batch.length === 0) break;
      const map = listToMap(batch);
      const query = encodeURIComponent(batch.map((b) => b.id).join(','));
      fetch(`https://solved.ac/api/v3/problem/lookup?problemIds=${query}`)
        .then((res) => res.json())
        .then((res) => {
          res.forEach(({ problemId, level, titleKo }) => {
            const e = map[problemId].element;
            e.setAttribute('data-tier', level);
            e.setAttribute('data-problem-id', problemId);
            e.setAttribute('data-problem-title', titleKo);
          });
        });
    }
  }
}
