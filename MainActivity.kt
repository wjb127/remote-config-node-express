package com.remoteconfig

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RemoteConfigApp()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RemoteConfigApp() {
    var configData by remember { mutableStateOf<ConfigData?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    // Config API 호출
    LaunchedEffect(Unit) {
        scope.launch {
            try {
                // 실제 구현에서는 Retrofit이나 HTTP 클라이언트 사용
                configData = loadConfigFromAPI()
                isLoading = false
            } catch (e: Exception) {
                isLoading = false
                Toast.makeText(context, "설정 로드 실패: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }

    Scaffold(
        bottomBar = {
            // 동적 하단 툴바 구현
            configData?.toolbars?.find { it.position == "bottom" }?.let { toolbar ->
                DynamicBottomToolbar(
                    toolbar = toolbar,
                    onButtonClick = { buttonId, action ->
                        handleToolbarAction(context, buttonId, action)
                    }
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            } else {
                configData?.let { config ->
                    MainContent(config = config)
                } ?: run {
                    Text(
                        text = "설정을 불러올 수 없습니다",
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
            }
        }
    }
}

@Composable
fun MainContent(config: ConfigData) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 앱 정보 표시
        item {
            AppInfoCard(appInfo = config.app)
        }
        
        // 메뉴 목록 표시
        item {
            Text(
                text = "메뉴 목록",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        }
        
        items(config.menus) { menu ->
            MenuItemCard(menu = menu)
        }
        
        // 스타일 정보 표시
        item {
            Text(
                text = "스타일 설정",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        }
        
        items(config.styles) { style ->
            StyleItemCard(style = style)
        }
    }
}

@Composable
fun DynamicBottomToolbar(
    toolbar: ToolbarData,
    onButtonClick: (String, String) -> Unit
) {
    val backgroundColor = parseColor(toolbar.backgroundColor)
    val textColor = parseColor(toolbar.textColor)
    
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(toolbar.height.dp),
        color = backgroundColor,
        shadowElevation = 8.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            toolbar.buttons.forEach { button ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(8.dp)
                ) {
                    IconButton(
                        onClick = { onButtonClick(button.id, button.action) },
                        modifier = Modifier.size(40.dp)
                    ) {
                        Icon(
                            imageVector = getIconFromString(button.icon),
                            contentDescription = button.title,
                            tint = textColor,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Text(
                        text = button.title,
                        color = textColor,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}

@Composable
fun AppInfoCard(appInfo: AppInfo) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = appInfo.appName,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "패키지: ${appInfo.packageName}",
                fontSize = 14.sp,
                color = Color.Gray
            )
            Text(
                text = "버전: ${appInfo.version}",
                fontSize = 14.sp,
                color = Color.Gray
            )
            Text(
                text = appInfo.description,
                fontSize = 16.sp,
                modifier = Modifier.padding(top = 8.dp)
            )
        }
    }
}

@Composable
fun MenuItemCard(menu: MenuData) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = getIconFromString(menu.icon),
                contentDescription = menu.title,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = menu.title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "액션: ${menu.actionValue}",
                    fontSize = 12.sp,
                    color = Color.Gray
                )
            }
        }
    }
}

@Composable
fun StyleItemCard(style: StyleData) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = style.styleKey,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = style.styleValue,
                    fontSize = 14.sp,
                    color = Color.Blue
                )
                Text(
                    text = style.description,
                    fontSize = 12.sp,
                    color = Color.Gray
                )
            }
        }
    }
}

// 유틸리티 함수들
fun getIconFromString(iconName: String): ImageVector {
    return when (iconName.lowercase()) {
        "plus", "add" -> Icons.Default.Add
        "share" -> Icons.Default.Share
        "heart", "favorite" -> Icons.Default.Favorite
        "home" -> Icons.Default.Home
        "user", "person" -> Icons.Default.Person
        "settings" -> Icons.Default.Settings
        "help", "help-circle" -> Icons.Default.Help
        else -> Icons.Default.Circle
    }
}

fun parseColor(colorString: String): Color {
    return try {
        if (colorString.startsWith("#")) {
            Color(android.graphics.Color.parseColor(colorString))
        } else {
            Color.Gray
        }
    } catch (e: Exception) {
        Color.Gray
    }
}

fun handleToolbarAction(
    context: android.content.Context,
    buttonId: String,
    action: String
) {
    when (action) {
        "create_item" -> {
            Toast.makeText(context, "새 항목을 생성합니다", Toast.LENGTH_SHORT).show()
            // 실제 구현: 새 항목 생성 화면으로 이동
        }
        "share_content" -> {
            Toast.makeText(context, "콘텐츠를 공유합니다", Toast.LENGTH_SHORT).show()
            // 실제 구현: 공유 인텐트 실행
        }
        "toggle_favorite" -> {
            Toast.makeText(context, "즐겨찾기를 토글합니다", Toast.LENGTH_SHORT).show()
            // 실제 구현: 즐겨찾기 상태 변경
        }
        else -> {
            Toast.makeText(context, "$buttonId 버튼이 클릭되었습니다", Toast.LENGTH_SHORT).show()
        }
    }
}

// 간단한 데이터 클래스들 (실제로는 별도 파일에 정의)
data class ConfigData(
    val app: AppInfo,
    val menus: List<MenuData>,
    val toolbars: List<ToolbarData>,
    val styles: List<StyleData>
)

data class AppInfo(
    val appName: String,
    val packageName: String,
    val version: String,
    val description: String
)

data class MenuData(
    val title: String,
    val icon: String,
    val actionValue: String
)

data class ToolbarData(
    val position: String,
    val backgroundColor: String,
    val textColor: String,
    val height: Int,
    val buttons: List<ButtonData>
)

data class ButtonData(
    val id: String,
    val icon: String,
    val title: String,
    val action: String
)

data class StyleData(
    val styleKey: String,
    val styleValue: String,
    val description: String
)

// Config API 호출 함수 (실제로는 Repository 패턴 사용)
suspend fun loadConfigFromAPI(): ConfigData {
    // 실제 Config API 응답을 시뮬레이션
    return ConfigData(
        app = AppInfo(
            appName = "테스트 앱",
            packageName = "com.test.simple",
            version = "1.0.0",
            description = "간단한 Remote Config 테스트용 앱입니다"
        ),
        menus = listOf(
            MenuData("홈", "home", "/home"),
            MenuData("프로필", "user", "/profile"),
            MenuData("설정", "settings", "/settings"),
            MenuData("도움말", "help-circle", "/help")
        ),
        toolbars = listOf(
            ToolbarData(
                position = "bottom",
                backgroundColor = "#FFFFFF",
                textColor = "#007AFF",
                height = 64,
                buttons = listOf(
                    ButtonData("add", "plus", "추가", "create_item"),
                    ButtonData("share", "share", "공유", "share_content"),
                    ButtonData("favorite", "heart", "즐겨찾기", "toggle_favorite")
                )
            )
        ),
        styles = listOf(
            StyleData("primary_color", "#007AFF", "메인 색상"),
            StyleData("background_color", "#F5F5F5", "배경색"),
            StyleData("font_size", "16sp", "글자 크기"),
            StyleData("button_radius", "8dp", "버튼 둥글기"),
            StyleData("toolbar_height", "56dp", "툴바 높이")
        )
    )
} 