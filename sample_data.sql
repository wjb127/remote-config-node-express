-- 샘플 앱 데이터
INSERT INTO public.app (app_name, app_id, package_name, version, description, status)
VALUES 
  ('테스트 앱', 'com.example.testapp', 'com.example.testapp', '1.0.0', '테스트용 앱입니다.', 'active'),
  ('개발 앱', 'com.example.devapp', 'com.example.devapp', '2.0.0', '개발용 앱입니다.', 'active');

-- 샘플 메뉴 데이터
INSERT INTO public.menu (app_id, menu_id, title, icon, order_index, menu_type, action_type, action_value)
SELECT 
  a.id,
  'home',
  '홈',
  'home',
  1,
  'item',
  'navigate',
  '/home'
FROM public.app a
WHERE a.app_id = 'com.example.testapp';

INSERT INTO public.menu (app_id, menu_id, title, icon, order_index, menu_type, action_type, action_value)
SELECT 
  a.id,
  'settings',
  '설정',
  'settings',
  2,
  'item',
  'navigate',
  '/settings'
FROM public.app a
WHERE a.app_id = 'com.example.testapp';

-- 샘플 툴바 데이터
INSERT INTO public.app_toolbar (app_id, toolbar_id, title, position, background_color, text_color)
SELECT 
  a.id,
  'main_toolbar',
  '메인 툴바',
  'top',
  '#FFFFFF',
  '#000000'
FROM public.app a
WHERE a.app_id = 'com.example.testapp';

-- 샘플 FCM 토픽 데이터
INSERT INTO public.app_fcm_topic (app_id, topic_name, topic_id, description, is_default)
SELECT 
  a.id,
  'news_updates',
  'news_updates',
  '뉴스 업데이트 알림',
  true
FROM public.app a
WHERE a.app_id = 'com.example.testapp';

-- 샘플 스타일 데이터
INSERT INTO public.app_style (app_id, style_key, style_value, style_category, description)
SELECT 
  a.id,
  'primary_color',
  '#007AFF',
  'color',
  '기본 색상'
FROM public.app a
WHERE a.app_id = 'com.example.testapp';

INSERT INTO public.app_style (app_id, style_key, style_value, style_category, description)
SELECT 
  a.id,
  'font_family',
  'Noto Sans KR',
  'typography',
  '기본 폰트'
FROM public.app a
WHERE a.app_id = 'com.example.testapp'; 