//음표 둥둥
function random(min, max) {
  // `.toFixed()`를 통해 반환된 문자 데이터를,
  // `parseFloat()`을 통해 소수점을 가지는 숫자 데이터로 변환
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

function floatingObject(selector, delay, size) {
  gsap.to(selector, // 선택자
    random(1.5, 2.5), //지속시간
    { //옵션
      ease: "power1.inOut", //gsap easing 기능
      y: size,
      repeat: -1, //무한반복
      yoyo: true, //한번 재생된 애니메이션을 다시 뒤로 재생을 해서 반복하게 함.
      delay: random(0, delay),
    })
};

floatingObject('.flow1', .5, 30);
floatingObject('.flow2', .5, 30);
floatingObject('.flow3', 1, 40);
floatingObject('.flow4', 1, 40);

// 사운드파동
const ellipes = document.querySelectorAll('.wrapper div');
const duration = 500;

function showNextEllipse() {
  ellipes.forEach(el => el.classList.remove('visible'));

  ellipes.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, idx * duration);
  });

  const totalTime = ellipes.length * duration

  setTimeout(() => {
    ellipes.forEach(el => el.classList.remove('visible'));
    // 다음 반복 시작
    setTimeout(showNextEllipse, duration);
  }, totalTime);
}

showNextEllipse();

//lp 클릭 & 음원 재생
const lps = document.querySelectorAll('.lp');
let currentOpenLp = null;
let player;
let currentVideoId = '';
let isPlaying = false;

const tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  console.log("YouTube API Ready ✅");
  player = new YT.Player('player', {
    height: '0', // 숨기기
    width: '0',
    videoId: '', // 초기 영상 없음
    events: {
      'onReady': () => {
        console.log("youtube player ready")
      }
    }
  })
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

lps.forEach((lp, index) => {
  const lp_img = lp.querySelector('.image');
  const lp_ellipse = lp.querySelector('.lp_ellipse');


  lp_img.addEventListener('click', (e) => {
    e.stopPropagation();

    const videoId = lp.dataset.youtube;
    if (currentOpenLp && currentOpenLp !== lp) {
      const openEllipse = currentOpenLp.querySelector('.lp_ellipse');
      currentOpenLp.classList.remove('open');
      gsap.to(openEllipse, {
        x: 0,
        duration: 0.5
      });

      content.scrollBy({
        left: 0,
        behavior: 'smooth',
      })

      if (player && isPlaying) {
        player.pauseVideo();
        player.seekTo(0, true);
        isPlaying = false;
      }
      if (spinning) {
        spinning.kill();
        gsap.set(lp_ellipse, {
          rotation: 0
        });
        spinning = null;
      }
    }

    const isOpen = lp.classList.contains('open');

    if (!isOpen) {
      lp.classList.add('open');

      gsap.to(lp_ellipse, {
        x: 250,
        duration: .5,
      });

      content.scrollBy({
        left: 250,
        behavior: 'smooth',
      })

      if (index == 0) {
        content.scrollBy({
          left: 0,
          behavior: 'smooth'
        })
      }

      //회전
      spinning = gsap.to(lp_ellipse, {
        rotation: 360,
        duration: 10,
        ease: "linear",
        repeat: -1,
        transformOrigin: "50% 50%",
      })

      currentOpenLp = lp;

      if (videoId && player) {
        if (videoId !== currentVideoId) {
          console.log(videoId)
          console.log(player)
          player.loadVideoById(videoId);
          currentVideoId = videoId;
        } else {
          player.playVideo();
        }
        isPlaying = true;
      }

    } else {
      lp.classList.remove('open');
      gsap.to(lp_ellipse, {
        x: 0,
        duration: .5,
      });
      content.scrollBy({
        left: -250,
        behavior: 'smooth',
      })
      currentOpenLp = null
      // 영상 정지
      if (player) {
        player.pauseVideo();
        player.seekTo(0, true);
        isPlaying = false;
      }
      if (spinning) {
        spinning.kill();
        gsap.set(lp_ellipse, {
          rotation: 0
        });
        spinning = null;
      }
    };
  });
})

//이전, 다음 버튼 swiper
const prev_btn = document.querySelector('.prev');
const next_btn = document.querySelector('.next');
const content = document.querySelector('.content');
const lp = document.querySelector('.lp');


const lpWidth = lp.offsetWidth + parseInt(getComputedStyle(lp).marginRight);

prev_btn.addEventListener('click', () => {
  content.scrollBy({
    left: -lpWidth,
    behavior: 'smooth'
  });
})

next_btn.addEventListener('click', () => {
  content.scrollBy({
    left: lpWidth,
    behavior: 'smooth'
  });
});


//id 값으로 장르 분류하기(active가 아닌게 보이는것)
const genreMenu = document.querySelector('.genre');
genreMenu.addEventListener('click', ()=>{
albums.forEach(album => {
album.classList.add('active');
})
})

const genreItems = document.querySelectorAll('.sub li');
const albums = document.querySelectorAll('.album');

albums.forEach(album => {
album.classList.add('active');
})

genreItems.forEach(genre =>{
  genre.addEventListener('click', ()=>{
    const selectedGenre = genre.id;
    const isAlreadySelected = genre.classList.contains('selected');

    // 🔹 모든 li에서 .selected 제거
    genreItems.forEach(item => item.classList.remove('selected'));

    // 🔸 클릭된 li에 .selected 추가
    genre.classList.add('selected');

    albums.forEach(album => {
  if(selectedGenre == album.id)
    {
      album.classList.add('active');
    }
  else{
    album.classList.remove('active');
   }
    })
  if (!isAlreadySelected) {
  // 새로 선택된 장르
    genre.classList.add('selected');
    albums.forEach(album => {
      if (selectedGenre == album.id) {
       album.classList.add('active');
      }
    });
  } 
  else {
  // 이미 선택된 장르를 다시 클릭한 경우 → 전체 보이게
  albums.forEach(album => album.classList.add('active'));
  genre.classList.remove('selected');
  }
  })
}
)