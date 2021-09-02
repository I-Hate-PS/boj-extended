function extendVs() {
  const { pathname } = window.location;
  const urlPrefix = '/vs/';
  const users = pathname.substr(urlPrefix.length).split('/') || [];
  if (users.length !== 2) {
    alert('비교 대상은 2명만 가능합니다.');
    window.history.back();
    return;
  }

  const container = document.getElementsByClassName('container content')[0];
  container.innerHTML = '';

  const vsform = createVsForm(users[0], users[1]); // eslint-disable-line no-undef
  vsform.style.marginBottom = '20px';
  container.appendChild(vsform);

  const tagByPid = {};

  fetchProblems(users[0], async (p1) => {
    let solved1 = [];
    let tried1 = [];
    let unsolved1 = [];
    await p1.forEach((p) => {
      if (p.title.startsWith('맞은')) solved1 = p.tags;
      else {
        if (p.title.startsWith('맞았')) tried1 = p.tags;
        unsolved1 = p.tags;
      }
    });
    fetchProblems(users[1], async (p2) => {
      let solved2 = [];
      let tried2 = [];
      let unsolved2 = [];
      await p2.forEach((p) => {
        if (p.title.startsWith('맞은')) solved2 = p.tags;
        else {
          if (p.title.startsWith('맞았')) tried2 = p.tags;
          unsolved2 = p.tags;
        }
      });

      const solvedBoth = solved1
        .filter((p) => solved2.includes(p))
        .map(createProblemTag);
      const solved1Only = solved1
        .filter((p) => !solved2.includes(p))
        .map(createProblemTag);
      const solved2Only = solved2
        .filter((p) => !solved1.includes(p))
        .map(createProblemTag);
      const solvedNobody = unsolved1
        .filter((p) => unsolved2.includes(p))
        .map(createProblemTag);

      const userHref1 = Utils.createElement('a', { href: '/user/' + users[0] });
      userHref1.innerText = users[0];
      const userHref2 = Utils.createElement('a', { href: '/user/' + users[1] });
      userHref2.innerText = users[1];

      container.appendChild(
        createPanel(
          userHref1.outerHTML + '와 ' + userHref2.outerHTML + ' 모두 푼 문제',
          solvedBoth
        )
      );
      container.appendChild(
        createPanel(userHref1.outerHTML + '만 푼 문제', solved1Only)
      );
      container.appendChild(
        createPanel(userHref2.outerHTML + '만 푼 문제', solved2Only)
      );
      container.appendChild(createPanel('둘 다 풀지 못한 문제', solvedNobody));
    });
  });

  function createProblemTag(pid) {
    const a = tagByPid[pid];
    a.style.display = 'inline-block';
    a.style.marginRight = '3px';
    a.innerText = pid;
    return a;
  }

  // title: string, body: Node
  function createPanel(title, tags) {
    const panel = Utils.createElement('div', { class: 'panel panel-default' });
    const phead = Utils.createElement('div', { class: 'panel-heading' });
    const pbody = Utils.createElement('div', { class: 'panel-body' });
    phead.innerHTML = '<h3 class="panel-title">' + title + '</h3>';
    tags.forEach((t) => pbody.appendChild(t));
    panel.appendChild(phead);
    panel.appendChild(pbody);
    return panel;
  }

  function fetchProblems(username, response) {
    Utils.requestAjax(
      'https://www.acmicpc.net/user/' + username,
      (html, error) => {
        if (error) {
          alert('존재하지 않거나 잘못된 아이디입니다.');
          window.history.back();
          return;
        }
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const panels = doc.querySelectorAll('.panel');
        const problems = [];
        for (let i = 0; i < panels.length; ++i) {
          const tags = [];
          const title = panels[i].querySelector('.panel-title').innerText;
          panels[i].querySelectorAll('a[href^="/problem/"]').forEach((a) => {
            const pid = parseInt(a.href.substr(a.href.lastIndexOf('/') + 1));
            tags.push(pid);
            tagByPid[pid] = a;
          });
          problems.push({
            title: title,
            tags: tags,
          });
        }
        response(problems);
      }
    );
  }
}
